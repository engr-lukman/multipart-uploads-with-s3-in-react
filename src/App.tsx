import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { APP_NAME } from 'utils/AppConstant';
import UploadFeature from 'features/upload';

function App() {
  return (
    <>
      <div className="flex items-stretch h-screen overflow-hidden bg-white">
        <div className="w-full h-screen overflow-hidden bg-gray-700">
          <main className="flex-1 app-content h-screen overflow-auto bg-gray-500 text-yellow-300 text-sm">
            <header className="flex w-full h-[10vh] justify-center items-center bg-gray-700 px-10 text-lg font-bold">
              {APP_NAME}
            </header>
            <div className="flex w-full h-[85vh] justify-center items-start bg-gray-600">
              <div className="w-[90vw] h-[85vh] overflow-hidden bg-gray-500">
                <UploadFeature />
              </div>
            </div>
            <footer className="flex w-full h-[5vh] justify-center items-center bg-gray-700 px-10">
              {new Date().getFullYear()} &copy; S3 File upload services.
            </footer>
            <ToastContainer />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
