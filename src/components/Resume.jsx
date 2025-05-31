import "./Resume.css";
import "./DisplayExport.css";

import { SuperForm, RepeatableFormSection, ImageUpload } from "./SuperForm.jsx";

import { Fragment } from "react";

export function Form({ data, uploadData, leaveEditMode }) {
  const repeatingElements = {
    education: ({
      name = "",
      startDate = "",
      endDate = "",
      endDateIsCurrent = false,
      studyTitle = "",
    }) => {
      return (
        <>
          <label>
            Institution Name:{" "}
            <input name="name" type="text" defaultValue={name} />
          </label>

          <label>
            Title of Study:{" "}
            <input name="studyTitle" type="text" defaultValue={studyTitle} />
          </label>

          <fieldset>
            <legend>Dates attended:</legend>
            <label>
              Start Date:
              <input name="startDate" type="date" defaultValue={startDate} />
            </label>
            <label>
              End Date:
              <input name="endDate" type="date" defaultValue={endDate} />{" "}
            </label>
            <label>
              Currently Attending?{" "}
              <input
                name="endDateIsCurrent"
                type="checkbox"
                defaultChecked={endDateIsCurrent}
              />
            </label>
          </fieldset>
        </>
      );
    },
    practical: ({
      company = "",
      position = "",
      duties = "",
      startDate = "",
      endDate = "",
      endDateIsCurrent = "",
    }) => {
      return (
        <>
          <label>
            Company Name:
            <input name="company" type="text" defaultValue={company} />
          </label>

          <label>
            Position:
            <input name="position" type="text" defaultValue={position} />
          </label>

          <label>
            Duties:
            <textarea name="duties" defaultValue={duties} />
          </label>

          <fieldset>
            <legend>Dates employed:</legend>
            <label>
              Start Date:
              <input name="startDate" type="date" defaultValue={startDate} />
            </label>
            <label>
              End Date:
              <input name="endDate" type="date" defaultValue={endDate} />{" "}
            </label>
            <label>
              Currently Attending?{" "}
              <input
                name="endDateIsCurrent"
                type="checkbox"
                defaultChecked={endDateIsCurrent}
              />
            </label>
          </fieldset>
        </>
      );
    },
  };

  const submitData = (data) => {
    uploadData(data);
    leaveEditMode();
  };

  return (
    <SuperForm submitData={submitData}>
      <button type="submit" className="positive">
        Update Resume
      </button>
      <button type="button" onClick={leaveEditMode} className="negative">
        Discard Changes
      </button>
      <div data-section="personal">
        <h2>Personal Info</h2>
        <label>
          Name:{" "}
          <input
            name="name"
            type="text"
            defaultValue={data.personal?.name || ""}
          />
        </label>
        <label>
          Email:{" "}
          <input
            type="email"
            name="email"
            defaultValue={data.personal?.email || ""}
          />
        </label>
        <label>
          Phone Number:{" "}
          <input
            type="tel"
            name="phone"
            defaultValue={data.personal?.phone || ""}
          />
        </label>
        <ImageUpload
          title="Portrait Photo:"
          name="portrait"
          imageURL={data.personal?.portrait}
        />
      </div>
      <RepeatableFormSection
        title="Education"
        sectionName="education"
        RepeatingElement={repeatingElements.education}
        dataArray={data.education}
      />
      <RepeatableFormSection
        title="Practical Experience"
        sectionName="practical"
        RepeatingElement={repeatingElements.practical}
        dataArray={data.practical}
      />
    </SuperForm>
  );
}

export function Display({ data, enterEditMode }) {
  return (
    <>
      <button onClick={enterEditMode}>Edit</button>
      <button onClick={() => print()}>Print / Export</button>
      <div id={data.personal.portrait && "portrait-container"}>
        <img src={data.personal.portrait} alt="" />
      </div>
      <section>
        <h1>{data.personal.name}</h1>
        <h3>Contact:</h3>
        <ul>
          <li>{data.personal.email}</li>
          <li>{data.personal.phone}</li>
        </ul>
      </section>
      <section>
        <h1>Education</h1>
        {data.education?.map((education) => (
          <Fragment key={education.id}>
            <h2>{education.name}</h2>
            <strong>
              <p>{education.studyTitle}</p>
            </strong>
            <p>
              Attended from {education.startDate} to{" "}
              {education.endDateIsCurrent ? "now" : education.endDate}
            </p>
          </Fragment>
        ))}
      </section>
      <section>
        <h1>Practical Experience</h1>
        {data.practical?.map((practical) => (
          <Fragment key={practical.id}>
            <h2>{practical.company}</h2>
            <strong>
              <p>{practical.position}</p>
            </strong>
            <p>
              Employed from {practical.startDate} to{" "}
              {practical.endDateIsCurrent ? "now" : practical.endDate}
            </p>
            <h3>Duties:</h3>
            <ul>
              {practical.duties.split("\n").map((line) => (
                <li>{line}</li>
              ))}
            </ul>
          </Fragment>
        ))}
      </section>
    </>
  );
}
