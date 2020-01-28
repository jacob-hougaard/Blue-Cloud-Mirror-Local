<template>
    <div>
        <h1>It seems that you are not logged in. Please contact someone at your booth in order to save your highscore.</h1>
        <br/>
        <b-modal ref="bv-modal-error" hide-footer>
            <div class="d-block text-center">
                <h3>An error occured</h3>
                <p>{{this.modalText}}</p>
            </div>
            <b-button class="mt-3" block @click="hideModal">Close Me</b-button>
        </b-modal>
        <b-modal ref="bv-modal-success" hide-footer>
            <div class="d-block text-center">
                <h3>Success</h3>
                <p>{{this.modalText}}</p>
            </div>
            <b-button class="mt-3" block @click="hideModal">Close Me</b-button>
        </b-modal>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="input-1"
                    description="Please write your email."
            >
                <b-form-input
                        id="input-1"
                        v-model="form.email"
                        type="email"
                        required
                        placeholder="Enter email"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Your password" label-for="input-2" description="Please write your the password given to you by an administrator.">
                <b-form-input
                        id="input-2"
                        v-model="form.password"
                        required
                        type="password"
                        placeholder="please entter your password"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Your conference ID:" label-for="input-2" description="Please write the ID for your conference, if this is your first time logging in for this conference, please write in your intended ID and it will be created for you.">
                <b-form-input
                        id="input-3"
                        v-model="form.conferenceId"
                        required
                        placeholder="Please enter the ID for your conference"
                ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="dark" :loading="sendingForm">Submit</b-button>
            <b-button type="reset" variant="light" :loading="sendingForm">Reset</b-button>
        </b-form>
    </div>
</template>

<script>
    import { Component, Vue } from "vue-property-decorator";
    import axios from "axios";

    export default {
        name: "Login",
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                    conferenceId:''
                },
                show: true,
                modalText:"",
                isLoggedIn:false,
                sendingForm:true
            }
        },
        methods: {
            hideModal(){
                this.$refs['bv-modal-error'].hide();
                this.$refs['bv-modal-success'].hide();
            },
            onSubmit(evt) {
                evt.preventDefault()
                this.$store.commit("setConferenceId",this.form.conferenceId);
                // send login request to backend
                axios.post(this.$store.state.apis.login.url,{
                    username:this.form.email,
                    password:this.form.password
                }).then((response) => {
                    // Save JWT in local storage
                    if(response.data.error){
                        this.modalText = "An error occured while logging in: " + "'" + response.data.error + "'";
                        this.$store.commit("setLoggedInStatus",false);
                    }else{
                        this.$store.commit("setAuthToken",response.data.token);
                        this.$store.commit("setLoggedInStatus",true);
                        this.modalText = "Successfully logged in.";
                    }
                }).catch((error) => {
                    //TODO - Make a popup appear if user cannot authenticate
                    this.modalText = "An error occured while logging in: " + "'" + error + "'";
                });
                setTimeout(()=>{
                    if(this.$store.state.isLoggedIn === true){
                        // Redirect
                        this.$refs['bv-modal-success'].show();
                        this.$router.push('Home')
                    }else{
                        this.$refs['bv-modal-error'].show()
                    }
                    console.log(this.isLoggedIn);
                },500)
            },
            onReset(evt) {
                evt.preventDefault()
                // Reset our form values
                this.form.email = ''
                this.form.name = ''
                this.form.conferenceId = ''
                // Trick to reset/clear native browser form validation state
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            }
        }
    }
</script>

<style scoped>

</style>