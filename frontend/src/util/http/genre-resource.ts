import { httpVideo } from ".";
import HttpResource from "./http-resource";

const GenreResource = new HttpResource(httpVideo, "genres");
export default GenreResource;