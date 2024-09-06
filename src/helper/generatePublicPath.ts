export const generatePublicPath =(url:string)=>{
    const splittedUrl = url.split("/");
    const folderName = splittedUrl.at(-2);
    const fileNamewithExtension = splittedUrl.at(-1);
    const splittedFileName = fileNamewithExtension?.split(".");
    if(splittedFileName){
        const fileName = splittedFileName[0];
        const publicPath = `${folderName}/${fileName}`;
        return publicPath;
    }
}