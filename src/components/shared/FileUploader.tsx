import React, { useCallback, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void,
    mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles : FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file]);

    const {getRootProps, getInputProps } = useDropzone({onDrop, accept: {
        'image/*':['.png', '.jpeg', '.jpg', '.svg']
    }})

    return (
        <div {...getRootProps()} className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
        <input {...getInputProps()} className="cursor-pointer"/>
        {
          fileUrl ? (
            <>
                <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                    <img  
                        src={fileUrl}
                        alt="image"
                        className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-top"
                    />
                </div>
                <p className="text-light-4 text-center small-regular w-full p-4 border-t border-t-dark-4">Click or drag photo to replace</p>
            </>
          ) : (
            <div className="file_uploader-box">
                <img src="/public/assets/icons/file-upload.svg" width={96} height={77} alt="file-upload" />
                <h3 className="text-[16px] font-medium leading-[140%] text-light-2 mb-2 mt-6">Drag photo here</h3>
                <p className="text-light-4 text-[14px] font-normal leading-[140%] mb-6">SVG, PNG, JPG</p>
                <Button className="shad-button_dark_4">Select from computer</Button>
            </div>
          )
        }
      </div>
    )
}

export default FileUploader;