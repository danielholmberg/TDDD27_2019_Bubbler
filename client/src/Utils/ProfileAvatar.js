import React, {useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './ProfileAvatar.css'

function Previews(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div className="Thumb" key={file.name}>
      <div className="ThumbInner">
        <img
          src={file.preview}
          alt=""
          className="Img"
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="ProfileAvatar">
      <div {...getRootProps({className: 'Dropzone'})}>
        <input {...getInputProps()} />
        <p><strong>Drag 'n' drop</strong> some files here, or <strong>click</strong> to select files</p>
      </div>
      <aside className="ThumbsContainer">
        {thumbs}
      </aside>
    </section>
  );
}

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "../../res/placeholder.jpg",
    }
  }


  render() {
    return (
      <Previews/>
    )
  }
}

export default ProfileAvatar