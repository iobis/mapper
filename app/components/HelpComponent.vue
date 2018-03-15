<template>
	<div>
		<div class="sideheader">Help</div>
		<div class="sidepanel">
			<div class="panelcontent">
				<p>This mapper is still being developed, please use the contact form below if you have any questions or feedback.</p>
				<h4>Contact</h4>
				<form>
					<div class="form-group">
						<label for="email">E-mail address</label>
						<input type="email" v-model="email" class="form-control" id="email">
					</div>
					<div class="form-group">
						<label for="message">Message</label>
						<textarea class="form-control" v-model="message" id="message" rows="4"></textarea>
					</div>
					<div v-if="result != null" class="alert alert-success">{{ result }}</div>
					<button type="button" class="btn btn-primary" v-on:click="send()">Send</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
    import api from "../api"

    export default {
        data() {
            return {
                "email": "",
				"message": "",
				"result": null
			}
        },
        methods: {
            clear: function() {
                this.email = ""
                this.message = ""
            },
            send: function() {
                let self = this
                api.email(this.email, this.message).then(res => {
                    self.result = "Message sent"
					self.clear()
                })
            }
        }
	}
</script>