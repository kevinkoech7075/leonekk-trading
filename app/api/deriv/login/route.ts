import {NextResponse} from 'next/server';
import crypto from 'crypto';
function b64(buf:Buffer){return buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export async function GET(req:Request){
 const client=process.env.DERIV_CLIENT_ID; const redirect=process.env.DERIV_REDIRECT_URI;
 if(!client||!redirect)return new NextResponse('Missing DERIV_CLIENT_ID or DERIV_REDIRECT_URI',{status:500});
 const verifier=b64(crypto.randomBytes(48)); const state=b64(crypto.randomBytes(24));
 const challenge=b64(crypto.createHash('sha256').update(verifier).digest());
 const url=new URL('https://auth.deriv.com/oauth2/auth');
 url.searchParams.set('response_type','code');url.searchParams.set('client_id',client);url.searchParams.set('redirect_uri',redirect);url.searchParams.set('scope','trade');url.searchParams.set('state',state);url.searchParams.set('code_challenge',challenge);url.searchParams.set('code_challenge_method','S256');
 const res=NextResponse.redirect(url); const secure=process.env.NODE_ENV==='production';
 res.cookies.set('leonekk_oauth_state',state,{httpOnly:true,secure,sameSite:'lax',maxAge:600,path:'/'});
 res.cookies.set('leonekk_pkce',verifier,{httpOnly:true,secure,sameSite:'lax',maxAge:600,path:'/'});
 return res;
}
