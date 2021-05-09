import { httpVideo } from ".";
import HttpResource from "./http-resource";

const CastMemberResource = new HttpResource(httpVideo, "cast_members");
export default CastMemberResource;