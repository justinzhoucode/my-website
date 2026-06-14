export default function About() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.02em]">justin zhou</h1>
      <p className="mt-6 text-subtle">
        working towards a bachelor of mathematics, majoring in combinatorics
        &amp; optimization with a computing minor, at{' '}
        <span className="whitespace-nowrap">
          <img
            src="/uwaterloo-seal.png"
            alt="University of Waterloo seal"
            className="mr-1.5 inline-block h-5 w-5 object-contain align-middle"
          />
          university of waterloo
        </span>
      </p>
      <p className="mt-6 text-subtle">me and miffy say hello!</p>
      <img
        src="/me-and-miffy.png"
        alt="justin and miffy the cat"
        loading="lazy"
        className="mt-3 w-full rounded-lg"
      />
    </>
  );
}
