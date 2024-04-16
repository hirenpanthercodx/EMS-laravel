import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes/index';
import { Toaster } from 'react-hot-toast';

    if (document.getElementById('example')) {
        const Index = ReactDOM.createRoot(document.getElementById("example"));
     
        Index.render(
            // <React.StrictMode>
            <>
                <Toaster position='top-right' toastOptions={{ className: 'react-hot-toast' }}/>
                <Router />
            </>
            // </React.StrictMode>
        )
    }



