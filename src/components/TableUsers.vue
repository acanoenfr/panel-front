<template>
    <div id="tableUsers">
        <v-data-table
            :headers="headers"
            :items="users"
            sort-by="name"
            class="elevation-4">
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>Utilisateurs enregistrés</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="formDialog" max-width="600px">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mb-2" color="primary" v-on="on" :disabled="!$store.getters.isAdmin">
                                    Ajouter un utilisateur
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="headline primary white--text">
                                    {{ formTitle }}
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-text-field label="Nom d'utilisateur" type="text" v-model="editedItem.name"></v-text-field>
                                        <v-text-field label="Adresse e-mail" type="text" v-model="editedItem.email"></v-text-field>
                                        <v-text-field label="Mot de passe" type="password" v-model="editedItem.password"></v-text-field>
                                        <v-checkbox label="Administrateur" v-model="editedItem.isAdmin"></v-checkbox>
                                        <v-checkbox label="Actif" v-model="editedItem.isActive"></v-checkbox>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="close">Annuler</v-btn>
                                    <v-btn class="primary" @click="save">Enregistrer</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="confirmDialog" max-width="500px">
                            <ConfirmDialog :closeDialog="closeConfirmDialog" :saveDialog="deleteItem">
                            </ConfirmDialog>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.isActive="{ item }">
                    {{ item.isActive ? 'Actif' : 'Inactif' }}
                </template>
                <template v-slot:item.isAdmin="{ item }">
                    {{ item.isAdmin ? 'Administrateur' : 'Utilisateur' }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon class="mr-2" title="Editer l'utilisateur" @click="editItem(item)" :disabled="!$store.getters.isAdmin || $store.getters.user.id === item.id">
                        mdi-pencil
                    </v-icon>
                    <v-icon color="red darken-1" class="mr-2" title="Supprimer l'utilisateur" @click="showConfirmDialog(item)" :disabled="!$store.getters.isAdmin || $store.getters.user.id === item.id">
                        mdi-delete
                    </v-icon>
                </template>
        </v-data-table>
    </div>
</template>

<script>
    import users from "../services/users"
    import ConfirmDialog from "./ConfirmDialog"

    export default {
        name: "TableUsers",
        data() {
            return {
                formDialog: false,
                confirmDialog: false,
                headers: [
                    { text: 'Etat', value: 'isActive' },
                    { text: 'Nom d\'utilisateur', value: 'name' },
                    { text: 'Adresse e-mail', value: 'email' },
                    { text: 'Groupe', value: 'isAdmin' },
                    { text: 'Actions', value: 'actions', sortable: false }
                ],
                users: [],
                editedIndex: -1,
                editedItem: { name: '', email: '', password: '', isActive: true, isAdmin: false },
                defaultItem: { name: '', email: '', password: '', isActive: true, isAdmin: false }
            }
        },
        components: {
            ConfirmDialog
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.users.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.editedItem.password = ''
                this.formDialog = true
            },
            deleteItem() {
                users.deleteUser(this.editedItem.id)
                    .then(info => {
                        if (info.error) {
                            this.$store.commit('CALL_MSG', {
                                text: info.error,
                                color: 'error',
                                show: true
                            })
                        } else {
                            this.$store.commit('CALL_MSG', {
                                text: info.message,
                                color: 'success',
                                show: true
                            })
                            this.users = this.users.filter(x => x.id !== this.editedItem.id)
                            this.closeConfirmDialog()
                        }
                    })
            },
            close() {
                this.formDialog = false
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },
            save() {
                if (this.editedIndex > -1) {
                    users.updateUser(this.editedItem)
                        .then(info => {
                            if (info.error) {
                                this.$store.commit('CALL_MSG', {
                                    text: info.error,
                                    color: 'error',
                                    show: true
                                })
                            } else {
                                this.$store.commit('CALL_MSG', {
                                    text: info.message,
                                    color: 'success',
                                    show: true
                                })
                            }
                        })
                } else {
                    users.createUser(this.editedItem)
                        .then(info => {
                            if (info.error) {
                                this.$store.commit('CALL_MSG', {
                                    text: info.error,
                                    color: 'error',
                                    show: true
                                })
                            } else {
                                this.$store.commit('CALL_MSG', {
                                    text: info.message,
                                    color: 'success',
                                    show: true
                                })
                            }
                        })
                }
                this.getUsers()
                this.close()
            },
            closeConfirmDialog() {
                this.confirmDialog = false
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },
            showConfirmDialog(item) {
                this.editedIndex = this.users.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.confirmDialog = true
            },
            getUsers() {
                users.getUsers()
                    .then(users => (this.users = users))
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Nouvel utilisateur' : 'Edition utilisateur'
            }
        },
        watch: {
            formDialog(val) {
                val || this.close()
            }
        },
        mounted() {
            this.getUsers()
        }
    }
</script>

<style scoped>

</style>