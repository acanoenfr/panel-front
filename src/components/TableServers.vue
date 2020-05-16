<template>
    <div id="tableServers">
        <v-data-table
            :headers="headers"
            :items="servers"
            sort-by="name"
            class="elevation-4">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Serveurs enregistrés</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="formDialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn class="mb-2" color="primary" v-on="on" :disabled="!$store.getters.isAdmin">
                                Ajouter un serveur
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline primary white--text">
                                {{ formTitle }}
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-text-field label="Nom" type="text" v-model="editedItem.name"></v-text-field>
                                    <v-text-field label="Chemin" type="text" v-model="editedItem.path"></v-text-field>
                                    <v-checkbox label="Proxy" v-model="editedItem.isProxy"></v-checkbox>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="closeDialog">Annuler</v-btn>
                                <v-btn class="primary" @click="saveDialog">Enregistrer</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="consoleDialog" max-width="900px">
                        <v-card>
                            <v-card-title class="headline grey darken-3 white--text">
                                <span>Console du serveur</span>
                                <v-spacer></v-spacer>
                                <v-btn color="white" icon @click="closeConsoleDialog">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                                <v-container>
                                    <v-textarea v-model="logs" id="logs" height="500px" filled no-resize readonly></v-textarea>
                                    <v-row align="center">
                                        <v-col cols="11">
                                            <v-text-field v-model="command" label="Entrez une commande"></v-text-field>
                                        </v-col>
                                        <v-col cols="1">
                                            <v-btn icon>
                                                <v-icon @click="sendCommand">mdi-send</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            <v-card-text>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="closeConsoleDialog">Fermer</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="confirmDialog" max-width="500px">
                        <ConfirmDialog :closeDialog="closeConfirmDialog" :saveDialog="deleteItem">
                        </ConfirmDialog>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.state="{ item }">
                {{ item.state === undefined ? 'Inconnu' : item.state }}
            </template>
            <template v-slot:item.isProxy="{ item }">
                {{ item.isProxy ? 'Waterfall' : 'Paper' }}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon v-if="item.state === 'Arrêté'" color="success" class="mr-2" title="Démarrer le serveur" @click="startItem(item.id)">
                    mdi-play
                </v-icon>
                <v-icon v-if="item.state === 'Démarré'" color="orange darken-1" class="mr-2" title="Arrêter le serveur" @click="stopItem(item.id)">
                    mdi-stop
                </v-icon>
                <v-icon class="mr-2" title="Afficher la console" @click="showConsoleDialog(item)">
                    mdi-console
                </v-icon>
                <v-icon class="mr-2" title="Editer le serveur" @click="editItem(item)" :disabled="!$store.getters.isAdmin">
                    mdi-pencil
                </v-icon>
                <v-icon color="red darken-1" class="mr-2" title="Supprimer le serveur" @click="showConfirmDialog(item)" :disabled="!$store.getters.isAdmin">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import servers from "../services/servers"
    import actions from "../services/actions"
    import ConfirmDialog from "./ConfirmDialog"

    export default {
        name: "TableServers",
        data() {
            return {
                formDialog: false,
                confirmDialog: false,
                consoleDialog: false,
                headers: [
                    { text: 'Etat', value: 'state', sortable: true },
                    { text: 'Nom', value: 'name', sortable: true },
                    { text: 'Type', value: 'isProxy', sortable: false },
                    { text: 'Chemin', value: 'path', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                logs: '',
                command: '',
                servers: [],
                editedIndex: -1,
                editedItem: { id: 0, name: '', isProxy: false, path: '' },
                defaultItem: { id: 0, name: '', isProxy: false, path: '' },
            }
        },
        components: {
            ConfirmDialog
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.servers.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.formDialog = true
            },
            closeConfirmDialog() {
                this.confirmDialog = false
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },
            showConfirmDialog(item) {
                this.editedIndex = this.servers.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.confirmDialog = true
            },
            deleteItem() {
                servers.deleteServer(this.editedItem.id)
                this.$store.commit('CALL_MSG', {
                    text: 'Le serveur a bien été supprimé.',
                    color: 'success',
                    show: true
                })
                this.servers = this.servers.filter(x => x.id !== this.editedItem.id)
                this.closeConfirmDialog()
            },
            showConsoleDialog(item) {
                actions.getServerLogs(item.id)
                    .then(res => (this.logs = res))
                this.editedIndex = this.servers.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.consoleDialog = true
            },
            closeConsoleDialog() {
                this.consoleDialog = false
                this.logs = ''
                this.command = ''
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },
            closeDialog() {
                this.formDialog = false
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            },
            saveDialog() {
                if (this.editedIndex > -1) {
                    servers.updateServer(this.editedItem)
                    Object.assign(this.servers[this.editedIndex], this.editedItem)
                    this.$store.commit('CALL_MSG', {
                        text: 'Le serveur a bien été édité.',
                        color: 'success',
                        show: true
                    })
                } else {
                    servers.createServer(this.editedItem)
                    this.servers.push(this.editedItem)
                    this.$store.commit('CALL_MSG', {
                        text: 'Le serveur a bien été ajouté.',
                        color: 'success',
                        show: true
                    })
                }
                this.closeDialog()
            },
            startItem(id) {
                actions.startServer(id)
                    .then(info => {
                        this.$store.commit('CALL_MSG', {
                            text: info.message,
                            color: 'info',
                            show: true
                        })
                        this.getServers()
                    })
            },
            stopItem(id) {
                actions.stopServer(id)
                    .then(info => {
                        this.$store.commit('CALL_MSG', {
                            text: info.message,
                            color: 'info',
                            show: true
                        })
                        this.getServers()
                    })
            },
            sendCommand() {
                actions.sendCommand(this.editedItem.id, this.command)
                this.$store.commit('CALL_MSG', {
                    text: 'Commande éxécutée avec succès.',
                    color: 'info',
                    show: true
                })
                this.closeConsoleDialog()
            },
            getServers() {
                servers.getAllServers()
                    .then(servers => {
                        this.servers = []
                        servers.forEach(async x => {
                            this.servers.push({
                                id: x.id,
                                name: x.name,
                                isProxy: x.isProxy,
                                path: x.path,
                                state: (await actions.getServerStatus(x.id)).message === 'Running' ? 'Démarré' : 'Arrêté'
                            })
                        })
                    })
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex > -1 ? 'Edition serveur' : 'Nouveau serveur'
            }
        },
        watch: {
            formDialog(val) {
                val || this.closeDialog()
            },
            confirmDialog(val) {
                val || this.closeConfirmDialog()
            },
            consoleDialog(val) {
                val || this.closeConsoleDialog()
            }
        },
        mounted() {
            this.getServers()
        }
    }
</script>

<style scoped>

</style>