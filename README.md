# `<RichTextInput>` for admin-on-rest (with image handler)

For editing HTML with [admin-on-rest](https://github.com/marmelab/admin-on-rest), use the `<RichTextInput>` component. It embarks [quill](http://quilljs.com/), a popular cross-platform Rich Text Editor.
**This version can use a upload API to upload image to remote storage, and then get a remote url instead of base64 data url**

![`<RichTextInput>` example](http://marmelab.com/admin-on-rest/img/rich-text-input.png)

## Installation

```sh
npm install aor-rich-text-input-with-image-handler --save-dev
```

## Usage

```js
import React from 'react';
import {
    DateInput,
    Edit,
    EditButton,
    LongTextInput,
    TextInput,
} from 'admin-on-rest/mui';
import RichTextInput from 'aor-rich-text-input-with-image-handler';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};
const uploadResourceAPI = "http://restful.demo/api/v1/" + "resources"
export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput source="title" validation={{ required: true }} />
        <LongTextInput source="teaser" validation={{ required: true }} />
        <RichTextInput source="body" validation={{ required: true }} uploadAPI={uploadResourceAPI} />
        <DateInput label="Publication date" source="published_at" />
    </Edit>
);
```

You can customize the rich text editor toolbar using the `toolbar` attribute, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

```js
<RichTextInput source="body" toolbar={[ ['bold', 'italic', 'underline', 'link'] ]} />
```

## License

This library is licensed under the [MIT Licence](LICENSE), and sponsored by [marmelab](http://marmelab.com).
