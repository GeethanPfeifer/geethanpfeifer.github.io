/*
    This file is part of Conway's Game of Life (yet another implementation)
    Copyright (C) 2024 Geethan Pfeifer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
"use strict";
var cgol = {
    birth: [false, false, false, true, false, false, false, false, false],
    survival: [false, false, true, true, false, false, false, false, false]
};
var GameOfLife = /** @class */ (function () {
    function GameOfLife(rule, length, height) {
        this.rule = rule;
        this.length = length;
        this.height = height;
        this.grid = new Array(height);
        for (var i = 0; i < this.height; i++) {
            this.grid[i] = new Array(length);
        }
    }
    GameOfLife.prototype.randomFill = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.length; j++) {
                this.grid[i][j] = Math.random() < 0.5;
            }
        }
    };
    GameOfLife.prototype.update = function () {
        var h = this.height;
        var l = this.length;
        var g2 = new Array(h);
        for (var i = 0; i < h; i++) {
            g2[i] = new Array(l);
        }
        var r = this.rule;
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[0].length; j++) {
                var k = 0;
                if (this.grid[(i + h - 1) % h][(j + l - 1) % l])
                    k++;
                if (this.grid[(i + h) % h][(j + l - 1) % l])
                    k++;
                if (this.grid[(i + h + 1) % h][(j + l - 1) % l])
                    k++;
                if (this.grid[(i + h - 1) % h][(j + l) % l])
                    k++;
                if (this.grid[(i + h + 1) % h][(j + l) % l])
                    k++;
                if (this.grid[(i + h - 1) % h][(j + l + 1) % l])
                    k++;
                if (this.grid[(i + h) % h][(j + l + 1) % l])
                    k++;
                if (this.grid[(i + h + 1) % h][(j + l + 1) % l])
                    k++;
                if (this.grid[i][j]) {
                    g2[i][j] = r.survival[k];
                }
                else {
                    g2[i][j] = r.birth[k];
                }
            }
        }
        this.grid = g2;
    };
    return GameOfLife;
}());
var CanvasGrid = /** @class */ (function () {
    function CanvasGrid(grid, canvasId) {
        this.grid = grid;
        this.height = grid.length;
        this.length = grid[0].length;
        this.canvas = document.getElementById(canvasId);
        this.renderingContext = this.canvas.getContext("2d");
        this.update();
    }
    CanvasGrid.prototype.update = function () {
        var rc = this.renderingContext;
        var h = this.height;
        var l = this.length;
        rc.clearRect(0, 0, l * 10, h * 10);
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < l; j++) {
                if (this.grid[i][j])
                    rc.fillRect(j * 10, i * 10, 10, 10);
            }
        }
    };
    return CanvasGrid;
}());
var world = new GameOfLife(cgol, 100, 100);
world.randomFill();
var canvasGrid = new CanvasGrid(world.grid, "c");
setInterval(function () {
    world.update();
    canvasGrid.grid = world.grid;
    canvasGrid.update();
}, 200);
