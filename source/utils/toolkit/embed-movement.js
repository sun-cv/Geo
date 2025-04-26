

function findPosition(grid, value)
{
    for (let row = 0; row < grid.length; row++) 
    {
        let column = grid[row].indexOf(value);
        if (column !== -1) return { row: row, column: column };
    }
    return null;
}

function move(grid, current, direction) 
{
    const pos = findPosition(grid, current);

    if (!pos) 
    {
        return current;
    }

    let { row, column } = pos;

    if (direction == "up") 
    {
        let newRow = row - 1;

        while (newRow >= 0 && column >= grid[newRow].length)
        {
            newRow--;
        }
        if (newRow >= 0)
        {
            row = newRow, column = Math.min(column, grid[row].length - 1);
        }
    }

    if (direction == "down") 
    {
        let newRow = row + 1;

        while (newRow < grid.length && column >= grid[newRow].length)
        {
            newRow++;
        }

        if (newRow < grid.length)
        {
            row = newRow, column = Math.min(column, grid[row].length - 1);
        }
    }

    if (direction == "left" && column > 0) 
    {
        column--;
    }

    if (direction == "right" && column + 1 < grid[row].length)
    {
        column++;
    }
    
    return grid[row][column];
}

export { move }