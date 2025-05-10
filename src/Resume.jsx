import { useState } from "react";

export function Form({ data, uploadData, leaveEditMode }) {
  const repeatingElements = {
    education: ({ name = "" }) => {
      return (
        <>
          <label>
            Education Name:{" "}
            <input name="name" type="text" defaultValue={name} />
          </label>
          <br />
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
          inputList.reduce(
            (obj, input) => Object.assign(obj, { [input.name]: input.value }),
            {},
          ),
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
      <fieldset data-section="personal">
        <legend>Personal Info</legend>
        <label>
          Name:{" "}
          <input
            name="name"
            type="text"
            defaultValue={data.personal?.name || ""}
          />
        </label>
      </fieldset>
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
      {data.education.map((info, index) => (
        <>
          <h2 key={index}>{info.name}</h2>
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
    <fieldset>
      <legend>{title}</legend>
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
    </fieldset>
  );
}
