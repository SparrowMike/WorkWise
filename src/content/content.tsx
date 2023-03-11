import './../styles/sass/content.scss';
import { interactiveBlob } from './interactiveBlob';

interactiveBlob();

//? not sure if we actually need the react here.... 
// import React, { useState } from 'react';
// import ReactDOM from 'react-dom';

// const App = () => {
//   const [pep, usePep] = useState(false);

//   function expand() {
//     console.log('clicking expand')
//   }

//   return (
//     <div>
//       <button onClick={() => expand()}>click</button>
//     </div>
//   );
// };

// const optionsElement = document.getElementById('my-extension');
// if (optionsElement) {
//   // @ts-ignore
//   const optionsRoot = ReactDOM.createRoot(optionsElement);
//   optionsRoot.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }