FROM registry.access.redhat.com/ubi8/ubi-init:latest
ENV SUMMARY="SSL verify"
ENV DESCRIPTION="Application runtime for SSL Verifier"
ENV AUTHOR="Holisticon AG"
ENV TZ="Europe/Berlin"
ENV NVM_DIR="$HOME/.nvm"
ENV CONSOLE_LOG="true"
ENV HOME=/opt/app
ENV NODE_VERSION="18"

LABEL summary="$SUMMARY" \
      description="$DESCRIPTION" \
      version="$VERSION" \
      author="$AUTHOR" \
      io.k8s.description="$DESCRIPTION" \
      io.k8s.display-name="sslverify" \
      io.k8s.tags="ssl,certificates" \
      com.redhat.component="sslverify-container"\
      org.label-schema.license=MIT

USER root

RUN mkdir -p $HOME 

# Copy code
ADD . $HOME

# Upgrade packages, install Pythion and clean up cache
RUN yum -y update &&  yum install -y python3 && rm -rf /tmp/setup && yum clean all && rm -rf /var/cache/yum

# Adding Node Version manager and install app
RUN export NVM_DIR="$HOME/.nvm" && mkdir -p $NVM_DIR && \
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.38.0/install.sh | bash && \
  chmod +x $HOME/.nvm/nvm.sh && echo "export NVM_DIR=\"$HOME/.nvm\"" >> ~/.bashrc && echo "[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"  # This loads nvm" >> ~/.bashrc && \
  source $NVM_DIR/nvm.sh && nvm install v${NODE_VERSION} && nvm use v${NODE_VERSION} && \
  rm -rf $HOME/node_modules/ && cd $HOME && npm i && \
  mv $HOME/bin/* /usr/local/bin/ && \
  chmod +x /usr/local/bin/* && chown -R $USER:$(id -gn $USER) $HOME

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
