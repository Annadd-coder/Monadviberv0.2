/**
 * This tiny page does two things:
 * 1. Supplies Twitter / Facebook with OG-meta for a MOAP
 * 2. Instantly redirects a real visitor to the raw image
 */
import Head from 'next/head';
import { supabase } from '../../../lib/supabaseClient';

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  const { data, error } = await supabase
    .from('moaps')
    .select('description,image_url')
    .eq('id', id)
    .single();

  if (error || !data) return { notFound: true };

  return {
    props: {
      id,
      title : data.description || `MOAP #${id}`,
      image : data.image_url,
    },
  };
}

export default function Share({ title, image }) {
  return (
    <>
      <Head>
        <title>{title}</title>

        {/* OpenGraph / Twitter */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content="MOAP on MonadViber pre-test" />
        <meta property="og:image"       content={image} />
        <meta property="twitter:card"   content="summary_large_image" />
        <meta property="twitter:title"  content={title} />
        <meta property="twitter:image"  content={image} />

        {/* Instant redirect to the PNG */}
        <meta httpEquiv="refresh" content={`0; url=${image}?raw=true`} />
      </Head>

      <p style={{textAlign:'center',marginTop:'3rem',fontFamily:'Lato,sans-serif'}}>
        Redirecting…
      </p>
    </>
  );
}