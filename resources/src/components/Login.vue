<template>
    <div class="login">
        <div class="card">
            <div class="card-header">Login</div>
            <div class="card-body">
                <div class="form-group row">
                    <label for="username" class="col-md-4 col-form-label col-form-label-lg">Username</label>
                    <div class="col-md-8">
                        <input id="username" class="form-control form-control-lg" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password" class="col-md-4 col-form-label col-form-label-lg">Password</label>
                    <div class="col-md-8">
                        <input type="password" id="password" class="form-control form-control-lg" />
                    </div>
                </div>

                <div class="float-right">
                    <button type="submit" class="btn btn-primary mb-2">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>
