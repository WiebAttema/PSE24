// src/components/codeBlackBox.jsx
// import React, { useEffect, useState } from 'react';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism-tomorrow.css'; // dark theme
// import 'prismjs/components/prism-clike'
// import 'prismjs/components/prism-markup'


// const CodeBlackBox = ({ code, language: initialLanguage = 'javascript' }) => {
//     const [language, setLanguage] = useState(initialLanguage)
//     useEffect(() => {
//         const loadPrismLanguage = async (language) => {
//             try {
//                 await import(`prismjs/components/prism-${language}`);
//             } catch (error) {
//                 console.warn(`PrismJS language component for "${language}" not found.`);
//                 setLanguage('javascript')
//                 import(`prismjs/components/prism-${language}`);
//             }
//         };

//         const highlightCode = async () => {
//             const lowerCaseLanguage = language.toLowerCase();
//             await loadPrismLanguage(lowerCaseLanguage);
//             Prism.highlightAll();
//         };

//         highlightCode();
//     }, [code, language]);

//     const lowerCaseLanguage = language.toLowerCase();

//     return (
//         <div className="code-black-box">
//             <div className="code-header">{language}</div>
//             <pre>
//                 <code className={`language-${lowerCaseLanguage}`}>
//                     {code}
//                 </code>
//             </pre>
//         </div>
//     );
// };

// export default CodeBlackBox;

// import React, { useEffect, useState } from 'react';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism-tomorrow.css'; // dark theme
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-markup';

// const CodeBlackBox = ({ code, language: initialLanguage = 'javascript' }) => {
//     const [language, setLanguage] = useState(initialLanguage);

//     // Update the language state when the initialLanguage prop changes
//     useEffect(() => {
//         setLanguage(initialLanguage);
//     }, [initialLanguage]);

//     useEffect(() => {
//         const loadPrismLanguage = async (language) => {
//             try {
//                 await import(`prismjs/components/prism-${language}`);
//             } catch (error) {
//                 console.warn(`PrismJS language component for "${language}" not found.`);
//                 setLanguage('javascript');
//                 await import(`prismjs/components/prism-javascript`);
//             }
//         };

//         const highlightCode = async () => {
//             const lowerCaseLanguage = language.toLowerCase();
//             await loadPrismLanguage(lowerCaseLanguage);
//             Prism.highlightAll();
//         };

//         highlightCode();
//     }, [code, language]);

//     const lowerCaseLanguage = language.toLowerCase();

//     return (
//         <div className="code-black-box">
//             <div className="code-header">{language}</div>
//             <pre>
//                 <code className={`language-${lowerCaseLanguage}`}>
//                     {code}
//                 </code>
//             </pre>
//         </div>
//     );
// };

// export default CodeBlackBox;

import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // dark theme
import 'prismjs/components/prism-clike'; // Common for C and similar languages

const CodeBlackBox = ({ code, language: initialLanguage = 'javascript' }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        setLanguage(initialLanguage);
    }, [initialLanguage]);

    useEffect(() => {
        const loadPrismLanguage = async (language) => {
            try {
                await import(`prismjs/components/prism-${language}`);
            } catch (error) {
                console.warn(`PrismJS language component for "${language}" not found.`);
                setLanguage('javascript');
                await import(`prismjs/components/prism-javascript`);
            }
        };

        const highlightCode = async () => {
            const lowerCaseLanguage = language.toLowerCase();
            await loadPrismLanguage(lowerCaseLanguage);
            Prism.highlightAll();
        };

        highlightCode();
    }, [code, language]);

    return (
        <div className="code-black-box">
            <div className="code-header">{language}</div>
            <pre>
                <code className={`language-${language.toLowerCase()}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

export default CodeBlackBox;

