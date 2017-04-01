import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';

require('./RichTextInput.css');

class RichTextInput extends Component {
    componentDidMount() {
        const {
            input: {
                value,
            },
            toolbar,
            uploadAPI
        } = this.props;
        // add a image handler
        const imageHandler = () => {
          const that = this.quill.getModule('toolbar')

          let fileInput = that.container.querySelector('input.ql-image[type=file]');
          if (fileInput == null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
            fileInput.classList.add('ql-image');

            //TODO: Modify this handler to upload image to server by REST.
            fileInput.addEventListener('change', () => {
              if (fileInput.files != null && fileInput.files[0] != null) {
                const resource = fileInput.files[0],
                // 1. store the image and get the image url.
                  formData = new FormData()
                formData.append('resource', resource)
                fetch(uploadAPI, {
                  method: 'post',
                  mode: 'cors',
                  headers: {
                    "Accept": 'application/json',
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                  },
                  body: formData
                })
                  .then(response => response.json())
                  .then((result) => {
                    if (result.resource) {
                      // 1. Get resource url.
                      const imageUrl = result.resource.url
                      // 2. insert the image into the editor.
                      let range = that.quill.getSelection(true);
                      that.quill.updateContents(new Delta()
                        .retain(range.index)
                        .delete(range.length)
                        .insert({ image: imageUrl })
                      , 'user');
                      fileInput.value = ""
                    }
                    else if (result.error) {
                      fileInput.value = ""
                      throw result.error
                    }
                  }).catch((error) => {
                    console.log('Request failed', error)
                  })
              }
            })
            that.container.appendChild(fileInput);
          }
          fileInput.click();
        }

        toolbar.handlers = {
          "image": imageHandler 
        } 

        this.quill = new Quill(this.divRef, {
            modules: { toolbar },
            theme: 'snow',
        });
        
        this.quill.pasteHTML(value);

        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', debounce(this.onTextChange, 500));
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.quill = null;
    }

    onTextChange = () => {
        this.props.input.onChange(this.editor.innerHTML);
    }

    updateDivRef = ref => {
        this.divRef = ref;
    }

    render() {
        return <div ref={this.updateDivRef} />;
    }
}

RichTextInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    addLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string,
    toolbar: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.bool,
    ]),
};

RichTextInput.defaultProps = {
    addField: true,
    addLabel: true,
    options: {},
    record: {},
    toolbar: true,
};

export default RichTextInput;
