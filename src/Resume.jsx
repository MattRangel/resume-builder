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

          <br />

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
  };

  const createDataObject = () => {
    const dataObject = {};
    const sections = new Set(
      Array.from(document.querySelectorAll("[data-section]")).map(
        (element) => element.dataset.section,
      ),
    );

    sections.forEach((section) => {
      const elementList = Array.from(
        document.querySelectorAll(`[data-section="${section}"`),
      );
      const repeatingItem = Object.hasOwn(repeatingElements, section);

      dataObject[section] = elementList
        .map((element) => Array.from(element.querySelectorAll("input")))
        .map((inputList) =>
          inputList.reduce((obj, input) => {
            return Object.assign(obj, {
              [input.name]:
                input[input.type === "checkbox" ? "checked" : "value"],
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
      </div>
      <RepeatableFormSection
        title="Education"
        sectionName="education"
        RepeatingElement={repeatingElements.education}
        dataArray={data.education}
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
      <h1>{data.personal.name}</h1>
      {data.education.map((education, index) => (
        <>
          <h2 key={index}>{education.name}</h2>
        </>
      ))}
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
