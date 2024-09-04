'use client';
import { del_col, del_row, directions } from '@/app/constant';
import { GridProps, pathFindingGridData } from '@/app/data/PathFindingGridData';
import { isValidDirection } from '@/app/lib/helpers';
import { Sleep } from '@/app/lib/sleepMethod';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const speedRange = 200;

const PathFind = () => {
  const [data, setData] = useState<GridProps[][]>([]);

  useEffect(() => {
    setData(pathFindingGridData);
  }, []);

  const perFormMazeRunnerDFS = async () => {
    try {
      const n = data?.length,
        m = data[0]?.length;

      const tempData = [...data];
      const paths: string[] = [];

      tempData[0][0].isCurrent = true;
      tempData[0][0].isVisit = true;

      setData([...tempData]);

      await Sleep(speedRange);

      // Start DFS from the top-left corner of the maze
      await dfs(tempData, paths, n, m, 0, 0, '');

      tempData[0][0].isCurrent = false;
      tempData[0][0].isVisit = false;

      setData([...tempData]);

      // Check if any paths were found
      if (paths.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(paths);
        }

        toast.success(`Found ${paths.length} unique path(s)!`);
      } else {
        toast.error('No valid paths found');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error, 'from catch');
      }
    }
  };

  const dfs = async (
    tempData: GridProps[][],
    paths: string[],
    n: number,
    m: number,
    row: number,
    col: number,
    path: string
  ) => {
    if (row === n - 1 && col === m - 1) {
      // Reached the destination
      paths.push(path);

      toast.success(`One valid path is found ${path}`);

      // Trace back the valid path
      let current = { rowIdx: row, colIdx: col };

      // Create a deep copy to trace path
      const pathData = tempData.map((row) => row.map((item) => ({ ...item })));

      while (current.rowIdx !== -1 && current.colIdx !== -1) {
        pathData[current.rowIdx][current.colIdx].isValidPath = true;
        current = tempData[current.rowIdx][current.colIdx].parent;

        setData([...pathData]);
        await Sleep(speedRange);
      }

      await Sleep(speedRange + speedRange);

      // Reset all `isValidPath` to false
      current = { rowIdx: row, colIdx: col }; // Reset current to the end of the path

      while (current.rowIdx !== -1 && current.colIdx !== -1) {
        pathData[current.rowIdx][current.colIdx].isValidPath = false;
        current = pathData[current.rowIdx][current.colIdx].parent;

        setData([...pathData]); // Update state with reset pathData
        await Sleep(speedRange);
      }

      return;
    }

    for (let i = 0; i < 4; i++) {
      const new_row = del_row[i] + row;
      const new_col = del_col[i] + col;

      if (isValidDirection(new_row, new_col, n, m) && !tempData[new_row][new_col].isVisit) {
        if (!tempData[new_row][new_col].data) {
          //
        }

        // Only move to cells with data === 1)
        else {
          tempData[new_row][new_col].isVisit = true;
          tempData[new_row][new_col].isCurrent = true;

          // Set parent for backtracking
          tempData[new_row][new_col].parent = {
            rowIdx: row,
            colIdx: col,
          };

          setData([...tempData]);
          await Sleep(speedRange);

          // Use a local path variable
          const newPath = path + directions[i % 4];

          // Recur for DFS
          await dfs(tempData, paths, n, m, new_row, new_col, newPath);

          // Backtrack
          tempData[new_row][new_col].isCurrent = false;
          tempData[new_row][new_col].isVisit = false;

          setData([...tempData]);
        }
      }
    }
  };

  return (
    <div className='container'>
      <div className='pb-5 pt-2'>
        <button className='root-btn' onClick={perFormMazeRunnerDFS}>
          Click
        </button>
      </div>
      {data?.length ? (
        <div className='item-center flex flex-col justify-start'>
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className='flex'>
              {row.map((col, colIndex) => {
                // active rat or ball
                const isBallActive = Boolean(col.isCurrent || (rowIndex === 0 && colIndex === 0));

                let BG_COLOR = col.data !== 1 ? 'bg-gray-600 text-white' : 'bg-white';

                if (col.isInvalid) BG_COLOR = 'bg-red-600 text-white';

                if (col.isCurrent) {
                  BG_COLOR = 'bg-blue-600 text-white';
                }

                if (col.isMarked) BG_COLOR = 'bg-pink-600 text-white';

                if (col.isValidPath) BG_COLOR = 'bg-green-600 text-white'; // Color for valid path

                const b = `border-[0.5px] border-gray-500`; // border-b-[0.5px] border-r-[0px] border-rose-400`;

                // if (rowIndex === data?.length - 1)
                //   b = `border-[1px] border-b-[0.5px] border-r-[0.5px] border-rose-400`;

                return (
                  <div className={`flex h-[120px] w-[120px] items-center justify-center ${b} ${BG_COLOR}`} key={col.id}>
                    {rowIndex === data?.length - 1 && colIndex === data[0].length - 1 ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='#FFD700'
                        className='h-[60px] w-[60px]'
                        viewBox='0 0 16 16'
                      >
                        <path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
                      </svg>
                    ) : isBallActive ? (
                      <svg fill={col.isCurrent ? '#fff' : '#000'} viewBox='0 0 463 463' className='h-[60px] w-[60px]'>
                        <g>
                          <path
                            d='M395.195,67.805C351.471,24.08,293.336,0,231.5,0S111.529,24.08,67.805,67.805S0,169.664,0,231.5
                            s24.08,119.971,67.805,163.695S169.664,463,231.5,463s119.971-24.08,163.695-67.805S463,293.336,463,231.5
                            S438.92,111.529,395.195,67.805z M409.648,108.393h-37.117L307.12,56.752L296.8,24.988c32.77,10.32,62.799,28.434,87.789,53.424
                            C393.919,87.741,402.28,97.779,409.648,108.393z M78.411,78.411c24.99-24.99,55.019-43.103,87.789-53.424L155.88,56.752
                            l-65.411,51.641H53.352C60.72,97.779,69.081,87.741,78.411,78.411z M15.005,231.119l27.714,20.136l23.327,72.625l-10.838,33.358
                            C29.094,320.789,15,277.23,15,231.5C15,231.373,15.004,231.247,15.005,231.119z M157.543,435.088l30.773-22.358h86.367
                            l30.773,22.358C282.063,443.57,257.123,448,231.5,448S180.936,443.57,157.543,435.088z M384.589,384.589
                            c-18.492,18.492-39.747,33.212-62.826,43.807l-40.235-29.232c-1.281-0.931-2.824-1.433-4.408-1.433h-91.24
                            c-1.584,0-3.127,0.501-4.408,1.432l-40.235,29.233c-23.078-10.594-44.333-25.315-62.825-43.807
                            c-4.223-4.223-8.238-8.597-12.064-13.095l14.713-45.283c0.487-1.498,0.489-3.111,0.008-4.611l-24.817-77.265
                            c-0.487-1.516-1.444-2.838-2.732-3.774l-37.74-27.42c2.664-31.926,12.256-62.427,28.054-89.748h49.24
                            c1.687,0,3.323-0.568,4.647-1.613l69.238-54.663c1.163-0.918,2.027-2.16,2.485-3.569l14.047-43.234
                            C199.066,16.804,215.144,15,231.5,15c16.356,0,32.434,1.804,48.01,5.313l14.047,43.234c0.458,1.409,1.322,2.651,2.485,3.569
                            l69.238,54.663c1.324,1.045,2.961,1.613,4.647,1.613h49.24c15.797,27.321,25.39,57.822,28.054,89.748l-38.941,28.291
                            c-1.309,0.951-2.274,2.299-2.754,3.843l-23.674,76.22c-0.46,1.481-0.45,3.068,0.029,4.542l14.77,45.456
                            C392.827,375.992,388.812,380.366,384.589,384.589z M407.793,357.237l-10.908-33.569l22.229-71.565l28.882-20.984
                            c0,0.127,0.005,0.253,0.005,0.38C448,277.23,433.906,320.789,407.793,357.237z'
                          />
                          <path
                            d='M321.098,196.503l-85.189-61.894c-2.629-1.91-6.188-1.91-8.816,0l-85.189,61.894c-2.629,1.91-3.729,5.295-2.725,8.385
                            l32.539,100.146c1.004,3.09,3.884,5.183,7.133,5.183H284.15c3.249,0,6.129-2.092,7.133-5.183l32.539-100.146
                            C324.826,201.798,323.727,198.413,321.098,196.503z M278.701,295.217h-94.402l-29.172-89.782l76.373-55.488l76.373,55.488
                            L278.701,295.217z'
                          />
                        </g>
                      </svg>
                    ) : null}

                    {col.isInvalid && (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='#fff'
                        className='h-[60px] w-[60px]'
                        viewBox='0 0 16 16'
                      >
                        <path d='M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z' />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PathFind;
