// import React, { useState } from 'react';
// import { SketchPicker } from 'react-color';

// const ColorPickerBox = () => {
//   const [color, setColor] = useState('#fff');

//   const handleChangeComplete = (color) => {
//     setColor(color.hex);
//   };

//   return (
//     <div>
//       <h3>Select a Color</h3>
//       <SketchPicker
//         color={color}
//         onChangeComplete={handleChangeComplete}
//       />
//       <div
//         style={{
//           marginTop: '20px',
//           width: '100px',
//           height: '100px',
//           backgroundColor: color,
//         }}
//       />
//     </div>
//   );
// };

// export default ColorPickerBox;

// src/templates/ColorBox.jsx
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPickerBox = ({ setColor }) => {
  const [color, setColorState] = useState('#fff');

  const handleChangeComplete = (color) => {
    setColorState(color.hex);
    setColor(color.hex); // Update parent component's state
  };

  return (
    <div>
      <h3>Select a Color</h3>
      <SketchPicker
        color={color}
        onChangeComplete={handleChangeComplete}
      />
      <div
        style={{
          marginTop: '20px',
          width: '100px',
          height: '100px',
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default ColorPickerBox;
