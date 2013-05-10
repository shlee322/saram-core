module.exports = function(saram, req, pipeline) {
    this.saram = saram;
    this.req = req;
    this.res = {};
    this.pipeline = pipeline;
    this.perm = {read:true, write:true};
    this.current = {};

    this.setResponse = function (res) {
        this.res = res;
    }
}