import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],

        ['link', 'image', 'video']
    ]
}

export default function CreatePost() {
    const navigate=useNavigate();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect]=useState(false);

    async function createNewPost(e) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        e.preventDefault();
        const response=await fetch('http://localhost:3001/post', {
            method: 'POST',
            body:data,
            credentials:'include'
        })
        if(response.ok){
            setRedirect(true);
        }

        console.log(await response.json())
    }
    if(redirect){
        navigate('/');
    }

    return (
        <form onSubmit={createNewPost} >
            <input type="title" placeholder={'Title'} value={title} onChange={e => { setTitle(e.target.value) }} />
            <input type="summary" placeholder={'Summary'} value={summary} onChange={e => { setSummary(e.target.value) }} />
            <input type="file" onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill value={content} onChange={newValue => { setContent(newValue) }} modules={modules} />
            <button style={{ marginTop: '5px' }}>Create Post</button>
        </form>
    )
}
