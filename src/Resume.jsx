import { useState } from "react";

export function Form({ data, uploadData, leaveEditMode }) {
  const repeatingElements = {
    education: ({
      name = "",
      startDate = "",
      endDate = "",
      endDateIsCurrent = true,
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

  const createDataObject = () => {
    const dataObject = {};
    const sections = new Set(
      Array.from(document.querySelectorAll("[data-section]")).map(
        (element) => element.dataset.section,
      ),
    );

    const valueOfInput = (element) => {
      switch (element.type) {
        case "checkbox":
          return element.checked;
        default:
          return element.value;
      }
    };

    sections.forEach((section) => {
      const elementList = Array.from(
        document.querySelectorAll(`[data-section="${section}"`),
      );
      const repeatingItem = Object.hasOwn(repeatingElements, section);

      dataObject[section] = elementList
        .map((element) =>
          Array.from(element.querySelectorAll("input, textarea")),
        )
        .map((inputList) =>
          inputList.reduce((obj, input) => {
            return Object.assign(obj, {
              [input.name]: valueOfInput(input),
            });
          }, {}),
        );
      if (!repeatingItem) {
        dataObject[section] = dataObject[section][0];
      }
    });

    return dataObject;
  };

  const sendData = () => {
    const dataObject = createDataObject();
    console.log(dataObject);
    uploadData(dataObject);
    leaveEditMode();
  };

  return (
    <form onSubmit={sendData}>
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
      <br />
      <button type="submit">Update Resume</button>
      <button type="button" onClick={leaveEditMode}>
        Discard Changes
      </button>
    </form>
  );
}

export function Display({ data, enterEditMode }) {
  return (
    <div>
      <button onClick={enterEditMode}>Edit</button>
      <section>
        <h1>{data.personal.name}</h1>
        <h3>Contact:</h3>
        <ul>
          <li>
            <a href={`mailto:${data.personal.email}`} />
            {data.personal.email}
          </li>
          <li>
            <a href={`tel:${data.personal.phone}`}>{data.personal.phone}</a>
          </li>
        </ul>
      </section>
      <section>
        <h1>Education</h1>
        {data.education?.map((education, index) => (
          <>
            <h2 key={index}>{education.name}</h2>
            <h3>{education.studyTitle}</h3>
            <p>
              Attended from {education.startDate} to{" "}
              {education.endDateIsCurrent ? "now" : education.endDate}
            </p>
          </>
        ))}
      </section>
      <section>
        <h1>Practical Experience</h1>
        {data.practical?.map((practical) => (
          <>
            <h2>{practical.company}</h2>
            <p>{practical.position}</p>
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
          </>
        ))}
      </section>
    </div>
  );
}

function RepeatableFormSection({
  title,
  RepeatingElement,
  dataArray = [],
  sectionName,
}) {
  const [elements, setElements] = useState(
    dataArray.map((data, index) => <RepeatingElement {...data} key={index} />),
  );

  const addElement = () => {
    setElements((elements) => [
      ...elements,
      <RepeatingElement key={+elements.at(-1)?.key + 1 || 0} />,
    ]);
  };

  const removeElement = (index) => {
    return () => {
      setElements((elements) => elements.toSpliced(index, 1));
    };
  };

  return (
    <div>
      <h2>{title}</h2>
      {elements.map((element, index) => (
        <div data-section={sectionName} key={element.key}>
          <button type="button" onClick={removeElement(index)}>
            Remove
          </button>
          {element}
        </div>
      ))}
      <button type="button" onClick={addElement}>
        Insert {title.toLowerCase()}
      </button>
    </div>
  );
}
