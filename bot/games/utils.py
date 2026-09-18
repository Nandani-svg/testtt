from __future__ import annotations

from typing import (
    Optional,
    Coroutine,
    Callable,
    Final,
    Union,
    TypeVar,
    TYPE_CHECKING,
    Any,
)

import functools
import asyncio

import discord
from discord.ext import commands

if TYPE_CHECKING:
    from typing_extensions import ParamSpec, TypeAlias
    P = ParamSpec("P")

T = TypeVar("T")

__all__: tuple[str, ...] = (
    "DiscordColor",
    "DEFAULT_COLOR",
    "executor",
    "chunk",
    "BaseView",
    "double_wait",
    "wait_for_delete",
)

DiscordColor = Union[discord.Color, int]

DEFAULT_COLOR: Final[discord.Color] = discord.Color(0x2F3136)


def chunk(iterable: list[T], *, count: int) -> list[list[T]]:
    return [iterable[i : i + count] for i in range(0, len(iterable), count)]


def executor() -> Callable[..., Callable[..., Coroutine[Any, Any, Any]]]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Coroutine[Any, Any, Any]]:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            partial = functools.partial(func, *args, **kwargs)
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, partial)
        return wrapper
    return decorator


async def double_wait(
    task1: asyncio.Task[Any],
    task2: asyncio.Task[Any],
) -> tuple[set[asyncio.Task[Any]], set[asyncio.Task[Any]]]:
    return await asyncio.wait(
        [task1, task2],
        return_when=asyncio.FIRST_COMPLETED,
    )


async def wait_for_delete(
    ctx: commands.Context,
    message: discord.Message,
    *,
    emoji: str = "⏹️",
    bot: Optional[commands.Bot] = None,
    timeout: Optional[float] = None,
) -> bool:
    _bot = bot or ctx.bot
    await message.add_reaction(emoji)

    def check(reaction: discord.Reaction, user: discord.User) -> bool:
        return (
            str(reaction.emoji) == emoji
            and user == ctx.author
            and reaction.message.id == message.id
        )

    try:
        await _bot.wait_for("reaction_add", timeout=timeout, check=check)
        await message.delete()
        return True
    except asyncio.TimeoutError:
        return False


class BaseView(discord.ui.View):
    def __init__(self, *, timeout: Optional[float] = None) -> None:
        super().__init__(timeout=timeout)

    def disable_all(self) -> None:
        for item in self.children:
            if isinstance(item, (discord.ui.Button, discord.ui.Select)):
                item.disabled = True

    async def on_timeout(self) -> None:
        self.disable_all()
        self.stop()
