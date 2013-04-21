module.exports = function(saram, req, res, pipeline) {
    this.saram = saram;
    this.req = req;
    this.res = res;
    this.pipeline = pipeline;
    this.perm = {read:true, write:true};
}