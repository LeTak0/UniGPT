
/**
 * @param {App.Locals} locals
 * @param {string} requiredRole
 */
export async function validateRole(locals, requiredRole) {
	let session = locals.session;
	if(!session) return false;
	if(session.role === requiredRole) return true;
	return false;
}