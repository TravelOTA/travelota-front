// Carga el perfil del usuario al arrancar la app si ya hay un token activo.
// Esto cubre el caso de refresh de página: el cookie persiste pero currentUser
// (useState) se reinicia, quedando la navbar sin datos hasta la siguiente navegación.
export default defineNuxtPlugin(async () => {
  const { isAuthenticated, currentUser, loadProfile } = useAuth();
  if (isAuthenticated.value && !currentUser.value) {
    await loadProfile();
  }
});
