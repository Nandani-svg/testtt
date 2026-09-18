from __future__ import annotations

from typing import NamedTuple

from .battleship import BattleShip
from .chess_game import Chess
from .button_games import BetaChess, BetaBattleShip

__all__: tuple[str, ...] = (
    "BattleShip",
    "Chess",
    "BetaChess",
    "BetaBattleShip",
)

__title__ = "discord_games"
__version__ = "1.10.6"
__author__ = "VIVID"

class VersionInfo(NamedTuple):
    major: int
    minor: int
    micro: int

version_info: VersionInfo = VersionInfo(
    major=1,
    minor=10,
    micro=6,
)

del NamedTuple, VersionInfo