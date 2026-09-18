const FileUpload = ({ file, setFile }) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="file-upload">
      <label htmlFor="pdf-file" className="file-label">
        Select PDF
      </label>

      <input
        id="pdf-file"
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
      />

      {file && (
        <div className="selected-file">
          <span>📄</span>
          <span>{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;