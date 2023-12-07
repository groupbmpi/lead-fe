import { RegistrationProvider } from "./RegistrationContext";

const withRegistrationProvider = (Page: any) => {
  const WrappedPage = (props: any) => (
    <RegistrationProvider>
      <Page {...props} />
    </RegistrationProvider>
  );

  return WrappedPage;
};

export default withRegistrationProvider;
