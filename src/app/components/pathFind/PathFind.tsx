'use client';

import { uid } from '@/app/lib/uidGenerator';
import React, { useState } from 'react';
import UniquePath from './UniquePath';

const PathFind = () => {
  // define local state
  const [buttonType, setButtonType] = useState<string>('unique-path');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [randomKey, setRandomKey] = useState<string>('');
  const [speedRange, setSpeedRange] = useState<number>(200);

  /** updated current button with it's type */
  const buttonMethod = () => setRandomKey(uid());

  /**
   * onChange method of select
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setButtonType(e.target.value);
  };

  /**
   * input type range method
   *
   * @param {*} e
   */
  const inputRangeMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedRange(Number(e.target.value));
  };

  return (
    <div className='pb-5'>
      <div className='container'>
        <div className='flex items-start justify-between'>
          <div className='me-6 w-[160px]'>
            <p className='m-0 mb-1 p-0 text-sm'>Speed: {speedRange} (0 to 1500)</p>
            <input
              value={speedRange}
              onChange={inputRangeMethod}
              type='range'
              id='points'
              name='points'
              min='0'
              max='1500'
            />
          </div>
          <div>
            <select
              onChange={handleSelectChange}
              value={buttonType}
              className='text-md cursor-pointer rounded-sm border-[1px] border-theme-primary px-[5px] py-[4px] outline-none transition-all duration-200 hover:border-theme-btn-secondary'
            >
              <option value='unique-path'>Unique Path</option>
            </select>

            <button
              onClick={buttonMethod}
              className={`ms-3 rounded-sm bg-theme-btn-secondary p-[8px] px-4 text-sm text-white transition-all duration-300`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {buttonType === 'unique-path' ? (
        <div className='container py-5'>
          <UniquePath key={randomKey} speedRange={speedRange} />
        </div>
      ) : null}
    </div>
  );
};

export default PathFind;
