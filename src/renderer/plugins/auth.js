export default function ({ $auth }) {
  const token = $auth.$storage.getState('token')
  console.log(token)
  console.log('auth plugin')
  if (token) {
    $auth.strategy.token.set(token)
  }
}
