import DOMPurify from "dompurify";

const DescriptionRender = ({description}: { description: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(description.replace(/\\\"/g, '\"'))}}
    />
  )
}

export default DescriptionRender;