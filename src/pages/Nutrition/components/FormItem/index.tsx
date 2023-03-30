import React from 'react';

type Props = {
  name?: string;
  dbField?: string;
  stateFunction?: any;
  initialValue?: any;
};

const FormItem: React.FC<Props> = ({ name, stateFunction, initialValue }) => {
  const updateStateFunction = (event: any) => {
    stateFunction(event.currentTarget.textContent.trim());
  };

  return (
    <div className=" pt-10 px-20">
      <div className="flex gap-20 pt-4">
        <div className="font-light my-auto w-130">{name}:</div>
        <div>
          <div className="font-light left text-xs border-opacity-30 w-200">
            <span
              className="appearance-none block py-1 px-2 rounded-md text-base placeholder-gray-400 focus:outline-none bg-lightDarkGray bg-opacity-20 text-white border-solid border border-white border-opacity-30"
              role="textbox"
              contentEditable
              suppressContentEditableWarning
              onInput={updateStateFunction}
            >
              {initialValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormItem;
