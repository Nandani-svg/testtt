from __future__ import annotations

from typing import Optional, Any
import asyncio
import string

import discord
from discord.ext import commands

from ..battleship import BattleShip, SHIPS, Ship, Board
from ..utils import DiscordColor, DEFAULT_COLOR, BaseView


class Player:
    def __init__(self, player: discord.User, *, game: BetaBattleShip) -> None:
        self.game = game
        self.player = player
        self.embed = discord.Embed(title="Log", description="```\n\u200b\n```")
        self._logs: list[str] = []
        self.approves_cancel: bool = False

    def update_log(self, log: str) -> None:
        self._logs.append(log)
        log_str = "\n\n".join(self._logs[-self.game.max_log_size:])
        if len(self._logs) > self.game.max_log_size:
            log_str = "...\n\n" + log_str
        self.embed.description = f"```diff\n{log_str}\n```"

    def __getattribute__(self, name: str) -> Any:
        try:
            return super().__getattribute__(name)
        except AttributeError:
            return self.player.__getattribute__(name)


class BattleshipInput(discord.ui.Modal, title="Input a coordinate"):
    def __init__(self, view: BattleshipView) -> None:
        super().__init__()
        self.view = view
        self.coord = discord.ui.TextInput(
            label="Enter your target coordinate",
            placeholder="e.g. a8",
            style=discord.TextStyle.short,
            required=True,
            min_length=2,
            max_length=3,
        )
        self.add_item(self.coord)

    async def on_submit(self, interaction: discord.Interaction) -> None:
        game = self.view.game
        content = self.coord.value.strip().lower()

        if not game.inputpat.fullmatch(content):
            return await interaction.response.send_message(
                f"`{content}` is not a valid coordinate!", ephemeral=True
            )

        raw, coords = game.get_coords(content)

        if coords in self.view.player_board.moves:
            return await interaction.response.send_message(
                "You've attacked this coordinate before!", ephemeral=True
            )

        await interaction.response.defer()
        await game.process_move(raw, coords)


class AttackButton(discord.ui.Button["BattleshipView"]):
    def __init__(self) -> None:
        super().__init__(
            label="Attack!",
            style=discord.ButtonStyle.red,
            emoji="🎯",
        )

    async def callback(self, interaction: discord.Interaction) -> None:
        game = self.view.game

        if interaction.user != game.turn:
            return await interaction.response.send_message(
                "It's not your turn!", ephemeral=True
            )

        modal = BattleshipInput(self.view)
        await interaction.response.send_modal(modal)


class CancelButton(discord.ui.Button["BattleshipView"]):
    def __init__(self) -> None:
        super().__init__(
            label="Cancel",
            style=discord.ButtonStyle.grey,
            emoji="🏳️",
        )

    async def callback(self, interaction: discord.Interaction) -> None:
        game = self.view.game
        player = self.view.player
        other_player = (
            game.player2 if interaction.user == game.player1.player else game.player1
        )

        if not player.approves_cancel:
            player.approves_cancel = True

        await interaction.response.defer()

        if not other_player.approves_cancel:
            await player.player.send("⏳ Waiting for opponent to approve cancellation...")
            await other_player.player.send(
                "Opponent wants to cancel. Press **Cancel** if you agree."
            )
        else:
            game.view1.disable_all()
            game.view2.disable_all()
            await game.player1.player.send("**GAME OVER** — Cancelled by mutual agreement.")
            await game.player2.player.send("**GAME OVER** — Cancelled by mutual agreement.")
            game.view1.stop()
            game.view2.stop()


class BattleshipView(BaseView):
    def __init__(
        self,
        game: BetaBattleShip,
        player: Player,
        *,
        timeout: Optional[float] = None,
    ) -> None:
        super().__init__(timeout=timeout)
        self.game = game
        self.player = player
        self.player_board: Board = game.game.get_board(player.player)
        self.add_item(AttackButton())
        self.add_item(CancelButton())

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user != self.player.player:
            await interaction.response.send_message(
                "This is not your game panel!", ephemeral=True
            )
            return False
        return True


class BetaBattleShip:
    def __init__(
        self,
        player1: discord.User,
        player2: discord.User,
        *,
        random: bool = True,
        max_log_size: int = 5,
    ) -> None:
        self.game = BattleShip(player1, player2, random=random)
        self.max_log_size = max_log_size

        self.player1 = Player(player1, game=self)
        self.player2 = Player(player2, game=self)

        self.view1: Optional[BattleshipView] = None
        self.view2: Optional[BattleshipView] = None

    @property
    def turn(self) -> discord.User:
        return self.game.turn

    async def process_move(self, raw: str, coords: tuple[int, int]) -> None:
        current = self.player1 if self.game.turn == self.player1.player else self.player2
        opponent = self.player2 if current is self.player1 else self.player1

        sunk, hit = self.game.place_move(self.game.turn, coords)

        if hit and sunk:
            current.update_log(f"+ {raw} → HIT + SUNK a ship!")
            opponent.update_log(f"- {raw} → Enemy hit and SUNK one of your ships!")
        elif hit:
            current.update_log(f"+ {raw} → HIT!")
            opponent.update_log(f"- {raw} → Enemy scored a HIT on you!")
        else:
            current.update_log(f"- {raw} → Miss.")
            opponent.update_log(f"+ {raw} → Enemy missed!")

        self.game.turn = opponent.player

        e1, f1, e2, f2 = await self.game.get_file(self.player1.player)
        e3, f3, e4, f4 = await self.game.get_file(self.player2.player)

        await self.player1.player.send(
            embeds=[e2, e1, self.player1.embed], files=[f2, f1]
        )
        await self.player2.player.send(
            embeds=[e4, e3, self.player2.embed], files=[f4, f3]
        )

        if winner := self.game.who_won():
            loser = self.player2.player if winner == self.player1.player else self.player1.player
            await winner.send("🎉 **You won!** Congratulations!")
            await loser.send("💀 **You lost!** Better luck next time.")
            self.view1.disable_all()
            self.view2.disable_all()
            self.view1.stop()
            self.view2.stop()

    async def start(
        self,
        ctx: commands.Context,
        *,
        timeout: Optional[float] = None,
        embed_color: DiscordColor = DEFAULT_COLOR,
    ) -> None:
        self.game.embed_color = embed_color

        await ctx.send(
            f"⚓ **Battleship** | {self.player1.player.mention} vs {self.player2.player.mention}\n"
            f"Game boards have been sent to your DMs!"
        )

        e1, f1, e2, f2 = await self.game.get_file(self.player1.player)
        e3, f3, e4, f4 = await self.game.get_file(self.player2.player)

        self.view1 = BattleshipView(self, self.player1, timeout=timeout)
        self.view2 = BattleshipView(self, self.player2, timeout=timeout)

        await self.player1.player.send(
            content="📋 **Your board (bottom) | Enemy board (top)**\nWait for your turn...",
            embeds=[e2, e1, self.player1.embed],
            files=[f2, f1],
            view=self.view1,
        )
        await self.player2.player.send(
            content="📋 **Your board (bottom) | Enemy board (top)**\nWait for your turn...",
            embeds=[e4, e3, self.player2.embed],
            files=[f4, f3],
            view=self.view2,
        )

        await asyncio.gather(self.view1.wait(), self.view2.wait())
