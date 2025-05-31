import { useState } from "react";
import removeSvg from "/src/assets/remove.svg";
import upSvg from "/src/assets/up.svg";
import downSvg from "/src/assets/down.svg";

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
    dataArray.map((data) => (
      <RepeatingElement {...data} key={crypto.randomUUID()} />
    )),
  );

  const shiftElement = (index, amount) => {
    setElements(() => {
      const newIndex = index + amount;
      return elements
        .toSpliced(index, 1)
        .toSpliced(newIndex, 0, elements[index]);
    });
  };

  const shiftPosOne = (index) => {
    return () => shiftElement(index, 1);
  };

  const shiftNegOne = (index) => {
    return () => shiftElement(index, -1);
  };

  const addElement = () => {
    setElements((elements) => [
      ...elements,
      <RepeatingElement key={crypto.randomUUID()} />,
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
          key={element.key + "_parent"}
        >
          {element}
          <div class="actions">
            <button
              type="button"
              onClick={shiftNegOne(index)}
              className="with-icon positive"
              disabled={index == 0}
            >
              <img src={upSvg} alt="" className="icon" />
              Raise
            </button>
            <button
              type="button"
              onClick={shiftPosOne(index)}
              className="with-icon positive"
              disabled={index == elements.length - 1}
            >
              <img src={downSvg} alt="" className="icon" />
              Lower
            </button>
            <button
              type="button"
              onClick={removeElement(index)}
              className="with-icon negative"
            >
              <img src={removeSvg} alt="" className="icon" />
              Delete
            </button>
          </div>
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
