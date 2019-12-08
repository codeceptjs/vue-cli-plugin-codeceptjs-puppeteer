<template>
  <div>
      <h1>Demo Component. Submit me!</h1>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="firstName">First name</label>
            <input type="text" v-model="data.first_name" class="form-control" id="firstName" placeholder="" value="" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="lastName">Last name</label>
            <input type="text" v-model="data.last_name" class="form-control" id="lastName" placeholder="" value="" required>
          </div>
        </div>

        <div class="mb-3">
          <label for="username">Username</label>
          <input type="text" class="form-control" v-model="data.username" id="username" placeholder="Username" required>
        </div>

        <div class="mb-3">
          <label for="email">Email</label>
          <input type="email" class="form-control" v-model="data.email" id="email" placeholder="you@example.com">
        </div>

        <div class="mb-3">
          <label for="address">Address</label>
          <input type="text" class="form-control" v-model="data.address" id="address" placeholder="1234 Main St" required>
        </div>
        <div>
          <button @click="submit()">Submit</button>
        </div>
        <div>
          <h1>Result</h1>
          <pre id="result" v-html="result"></pre>
        </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      result: '',
    };
  },
  methods: {
    submit() {
      this.result = JSON.stringify(this.data);
      return false;
    }
  }  
}
</script>

<style lang="css">
  h1 {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 16px;
  }
  input {
    margin-left: 20px;
    border: 1px solid silver;
  }

  button {
    background: blueviolet;
    padding: 20px 60px;
    color: white;
  }
</style>
