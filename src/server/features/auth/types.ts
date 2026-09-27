/** Shapes shared by the login action and the session reader. */

/** What `GET /user/me` actually returns — a different shape from login's
 * `user` object (`_id` not `id`, no `is_active`/`is_password_change`). Only
 * the fields this app actually reads are declared. */
export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  user: SessionUser;
}

export interface Session {
  user: SessionUser;
  /** The access token itself — callers that need to hit the backend directly
   * (the media proxy, the section-save action) send this as `Authorization:
   * Bearer <token>` rather than re-deriving it from cookies a second time. */
  token: string;
}
