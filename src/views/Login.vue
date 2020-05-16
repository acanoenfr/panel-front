<template>
    <div id="login">
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6">
                <FormLogin @login="login">
                </FormLogin>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import FormLogin from "../components/FormLogin"

    export default {
        name: "Login",
        components: {
            FormLogin
        },
        methods: {
            login(user) {
                this.$store.dispatch('login', user)
                    .then(() => {
                        this.$store.commit('CALL_MSG', {
                            text: 'Vous êtes désormais connecté.',
                            color: 'success',
                            show: true
                        })
                        this.$router.push('/Home')
                    })
                    .catch(() => {
                        this.$store.commit('CALL_MSG', {
                            text: 'Identifiants incorrects.',
                            color: 'error',
                            show: true
                        })
                    })
            }
        }
    }
</script>

<style>
</style>
