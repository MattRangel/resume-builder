export function Form({ data, uploadData, leaveEditMode }) {
  const sendData = (e) => {
    e.preventDefault();
    const dataObject = Object.fromEntries(new FormData(e.target));
    uploadData(dataObject);
    leaveEditMode();
  };

  return (
    <form onSubmit={sendData}>
      <label>
        Name: <input name="name" type="text" defaultValue={data.name || ""} />
      </label>
      <br />
      <button type="submit">Update Resume</button>
      <button onClick={leaveEditMode}>Discard Changes</button>
    </form>
  );
}

export function Display({ data, enterEditMode }) {
  return (
    <div>
      <button onClick={enterEditMode}>Edit</button>
      <h1>{data.name}</h1>
    </div>
  );
}
