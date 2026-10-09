import {NextRequest,NextResponse} from 'next/server';
export async function GET(req:NextRequest){
 const u=new URL(req.url), code=u.searchParams.get('code'), state=u.searchParams.get('state');
 const savedState=req.cookies.get('leonekk_oauth_state')?.value, verifier=req.cookies.get('leonekk_pkce')?.value;
 if(!state||!savedState||state!==savedState)return NextResponse.redirect(new URL('/?error=state_mismatch',req.url));
 if(!code||!verifier)return NextResponse.redirect(new URL('/?error=missing_oauth_data',req.url));
 const body=new URLSearchParams({grant_type:'authorization_code',client_id:process.env.DERIV_CLIENT_ID!,code,code_verifier:verifier,redirect_uri:process.env.DERIV_REDIRECT_URI!});
 const token=await fetch('https://auth.deriv.com/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
 if(!token.ok)return NextResponse.redirect(new URL('/?error=token_exchange_failed',req.url));
 const data=await token.json();
 const res=NextResponse.redirect(new URL('/dashboard',req.url));
 const secure=process.env.NODE_ENV==='production';
 res.cookies.delete('leonekk_oauth_state');res.cookies.delete('leonekk_pkce');
 res.cookies.set('leonekk_access_token',data.access_token,{httpOnly:true,secure,sameSite:'lax',maxAge:Math.max(300,Number(data.expires_in||3600)),path:'/'});
 return res;
}
