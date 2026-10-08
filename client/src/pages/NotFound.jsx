import { Button, PageHero } from "../components/ui.jsx";

export default function NotFound() {
  return (
    <PageHero eyebrow="404 · Signal lost" title="This route doesn’t exist." lede="The page you were looking for has moved or never existed.">
      <Button to="/" size="lg" arrow>Return to the system</Button>
    </PageHero>
  );
}
