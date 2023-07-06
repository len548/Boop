# Boop
A simplified version of the board game Boop as a browser-based application written in native JavaScript

The game board consists of a 6x6 grid of square cells.
The game is played by two players against each other, who take turns placing kittens on the field. The kittens of the two players must be different, e.g. in their colour or pattern.
The players have 8 kittens each, which are initially placed on the bench outside the game board.
Placing a new kitten on the board pushes the kittens (regardless of whether the kitten is yours or the oppenent's) in all adjacent cells one cell away from the location of the placement. (See image below!)
There is only one case when the kitten is not pushed away — if in the cell where it would arrive is already taken by another kitten.
The kittens on the edge of the board are also pushed away — they fall off the board and return to the bench of the player who placed them.

The goal of the game is to have three kittens of the same color (belonging to the same player) next to each other horizontally, vertically or diagonally after the pushing finishes. In this case, the player gets one point, and the three kittens are returned to their bench. (Attention! It is also possible that after pushing, three of the opponent's kittens land next to each other — in this case, the point goes to the opponent!)
The game can finish in two ways:
If any player reaches a specified target score. In this case this player is the winner.
If any player has all their kittens on the field at the same time. In this case, this player automatically loses, as they cannot play any move.
