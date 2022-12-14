use neon::prelude::*;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node from rust !!"))
}

register_module!(mut cx, {
    cx.export_function("hello", hello)
});
