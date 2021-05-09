import { httpVideo } from ".";
import HttpResource from "./http-resource";

const CategoryResource = new HttpResource(httpVideo, "categories");
export default CategoryResource;