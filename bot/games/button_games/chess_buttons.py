from __future__ import annotations

from typing import Optional
import discord
from discord.ext import commands

from ..chess_game import Chess
from ..utils import DiscordColor, DEFAULT_COLOR, BaseView


class ChessInput(discord.ui.Modal, title="Make your move"):
    def __init__(self, view: ChessView) -> None:
        super().__init__()
        self.view = view

        self.move_from = discord.ui.TextInput(
            label="From coordinate",
            style=discord.TextStyle.short,
            placeholder="e.g. e2",
            required=True,
            min_length=2,
            max_length=2,
        )
        self.move_to = discord.ui.TextInput(
            label="To coordinate",
            style=discord.TextStyle.short,
            placeholder="e.g. e4",
            required=True,
            min_length=2,
            max_length=2,
        )
        self.add_item(self.move_from)
        self.add_item(self.move_to)

    async def on_submit(self, interaction: discord.Interaction) -> None:
        game = self.view.game
        from_coord = self.move_from.value.strip().lower()
        to_coord = self.move_to.value.strip().lower()
        uci = from_coord + to_coord

        if interaction.user != game.turn:
            return await interaction.response.send_message(
                "It's not your turn!", ephemeral=True
            )

        try:
            game.board.parse_uci(uci)
        except ValueError:
            return await interaction.response.send_message(
                f"`{uci}` is not a valid move!", ephemeral=True
            )

        await game.place_move(uci)
        embed = await game.make_embed()

        if game.board.is_game_over():
            self.view.disable_all()
            result_embed = await game.fetch_results()
            await interaction.response.edit_message(embed=result_embed, view=self.view)
            await self.view.message.channel.send("~ Game Over ~")
            self.view.stop()
            return

        await interaction.response.edit_message(embed=embed, view=self.view)


class MoveButton(discord.ui.Button["ChessView"]):
    def __init__(self) -> None:
        super().__init__(
            label="Make Move",
            style=discord.ButtonStyle.blurple,
            emoji="♟️",
        )

    async def callback(self, interaction: discord.Interaction) -> None:
        game = self.view.game

        if interaction.user not in (game.white, game.black):
            return await interaction.response.send_message(
                "You are not a player in this game!", ephemeral=True
            )
        if interaction.user != game.turn:
            return await interaction.response.send_message(
                "It's not your turn!", ephemeral=True
            )

        modal = ChessInput(self.view)
        await interaction.response.send_modal(modal)


class ResignButton(discord.ui.Button["ChessView"]):
    def __init__(self) -> None:
        super().__init__(
            label="Resign",
            style=discord.ButtonStyle.red,
            emoji="🏳️",
        )

    async def callback(self, interaction: discord.Interaction) -> None:
        game = self.view.game

        if interaction.user not in (game.white, game.black):
            return await interaction.response.send_message(
                "You are not a player in this game!", ephemeral=True
            )

        winner = game.black if interaction.user == game.white else game.white
        self.view.disable_all()
        embed = discord.Embed(
            title="Chess Game",
            description=f"**{interaction.user.mention}** resigned!\n**{winner.mention}** wins! 🏆",
            color=discord.Color.green(),
        )
        embed.set_image(url=f"{game.BASE_URL}{game.board.board_fen()}")
        await interaction.response.edit_message(embed=embed, view=self.view)
        self.view.stop()


class ChessView(BaseView):
    def __init__(
        self,
        game: Chess,
        *,
        timeout: Optional[float] = None,
    ) -> None:
        super().__init__(timeout=timeout)
        self.game = game
        self.message: Optional[discord.Message] = None
        self.add_item(MoveButton())
        self.add_item(ResignButton())

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user not in (self.game.white, self.game.black):
            await interaction.response.send_message(
                "You are not a player in this game!", ephemeral=True
            )
            return False
        return True


class BetaChess:
    def __init__(self, *, white: discord.User, black: discord.User) -> None:
        self.game = Chess(white=white, black=black)

    async def start(
        self,
        ctx: commands.Context,
        *,
        timeout: Optional[float] = None,
        embed_color: DiscordColor = DEFAULT_COLOR,
    ) -> discord.Message:
        embed = await self.game.make_embed()
        view = ChessView(self.game, timeout=timeout)
        view.message = await ctx.send(
            content=f"⬜ **{self.game.white.mention}** vs ⬛ **{self.game.black.mention}**",
            embed=embed,
            view=view,
        )
        self.game.message = view.message
        await view.wait()
        return view.message
