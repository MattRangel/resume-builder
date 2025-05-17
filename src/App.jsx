import "./App.css";
import { Form as ResumeForm, Display as ResumeDisplay } from "./components/Resume.jsx";
import { useState } from "react";

function App() {
  const [resumeData, setResumeData] = useState({});
  const [editMode, setEditMode] = useState(true);

  return (
    <>
      {editMode ? (
        <ResumeForm
          data={resumeData}
          uploadData={setResumeData}
          leaveEditMode={() => setEditMode(false)}
        />
      ) : (
        <ResumeDisplay
          data={resumeData}
          enterEditMode={() => setEditMode(true)}
        />
      )}
    </>
  );
}

export default App;
