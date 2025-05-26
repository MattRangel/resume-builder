import { useState } from "react";
import removeSvg from "/src/assets/remove.svg";

export function SuperForm({ children, submitData }) {
  const createDataObject = (formElement) => {
    const dataObject = {};

    const sections = new Set(
      Array.from(formElement.querySelectorAll("[data-section]")).map(
        (element) => element.dataset.section,
      ),
    );

    const valueOfInput = (element) => {
      switch (element.type) {
        case "checkbox":
          return element.checked;
        case "file":
          return element.files[0]
            ? URL.createObjectURL(element.files[0])
            : element.parentElement.querySelector("img").src || null;
        default:
          return element.value;
      }
    };

    sections.forEach((section) => {
      const elementList = Array.from(
        formElement.querySelectorAll(`[data-section="${section}"`),
      );
      const isRepeating = Object.hasOwn(
        elementList[0].dataset,
        "repeatingSection",
      );

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
      if (!isRepeating) {
        dataObject[section] = dataObject[section][0];
      }
    });

    return dataObject;
  };

  const handleSubmit = (e) => {
    const dataObject = createDataObject(e.target);
    console.log(dataObject);
    submitData(dataObject);
  };

  return <form onSubmit={handleSubmit}>{children}</form>;
}

export function RepeatableFormSection({
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
      <button type="button" onClick={addElement} className="positive">
        Insert
      </button>
      {elements.map((element, index) => (
        <div
          data-section={sectionName}
          data-repeating-section
          key={element.key}
        >
          {element}
          <button
            type="button"
            onClick={removeElement(index)}
            className="with-icon negative"
          >
            <img src={removeSvg} alt="remove" className="icon" />
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export function ImageUpload({ title, name, imageURL }) {
  const [imgSrc, setImgSrc] = useState(imageURL || null);

  const fileUpdated = (e) => {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <label>
      {title}
      <img src={imgSrc} alt="" />
      <input
        type="file"
        accept="image/png, image/jpeg"
        name={name}
        onChange={fileUpdated}
      />
    </label>
  );
}
